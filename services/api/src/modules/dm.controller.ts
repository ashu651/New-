import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Client as Cassandra, types as CTypes } from 'cassandra-driver';

@Controller('dm')
export class DmController {
  private cs = new Cassandra({ contactPoints: [process.env.CASSANDRA_HOST || 'localhost'], localDataCenter: 'datacenter1' });

  @Post(':threadId/send')
  async send(
    @Param('threadId') threadId: string,
    @Body() body: { senderId: string; type: string; body?: string; ciphertext?: string; nonce?: string }
  ) {
    const ts = CTypes.TimeUuid.now();
    await this.cs.execute(
      'INSERT INTO snapzy.dm_messages(thread_id, ts_time, sender_id, type, body, ciphertext, nonce) VALUES(?,?,?,?,?,?,?)',
      [Number(threadId), ts, Number(body.senderId), body.type, body.body || null, body.ciphertext || null, body.nonce || null],
      { prepare: true }
    );
    return { ok: true, ts: String(ts) };
  }

  @Get(':threadId')
  async list(@Param('threadId') threadId: string) {
    const res = await this.cs.execute('SELECT * FROM snapzy.dm_messages WHERE thread_id = ? LIMIT 50', [Number(threadId)], { prepare: true });
    return res.rows;
  }
}