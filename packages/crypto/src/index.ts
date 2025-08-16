import nacl from 'tweetnacl';
import * as util from 'tweetnacl-util';

export function generateKeyPair() {
  const kp = nacl.box.keyPair();
  return { publicKey: util.encodeBase64(kp.publicKey), secretKey: util.encodeBase64(kp.secretKey) };
}

export function encryptMessage(message: string, recipientPublicKeyB64: string, senderSecretKeyB64: string) {
  const nonce = nacl.randomBytes(24);
  const msg = util.decodeUTF8(message);
  const recipientPk = util.decodeBase64(recipientPublicKeyB64);
  const senderSk = util.decodeBase64(senderSecretKeyB64);
  const box = nacl.box(msg, nonce, recipientPk, senderSk);
  return { nonce: util.encodeBase64(nonce), ciphertext: util.encodeBase64(box) };
}

export function decryptMessage(ciphertextB64: string, nonceB64: string, senderPublicKeyB64: string, recipientSecretKeyB64: string) {
  const ct = util.decodeBase64(ciphertextB64);
  const nonce = util.decodeBase64(nonceB64);
  const senderPk = util.decodeBase64(senderPublicKeyB64);
  const recipientSk = util.decodeBase64(recipientSecretKeyB64);
  const msg = nacl.box.open(ct, nonce, senderPk, recipientSk);
  if (!msg) throw new Error('Decryption failed');
  return util.encodeUTF8(msg);
}