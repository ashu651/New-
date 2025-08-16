USE snapzy;

ALTER TABLE dm_messages ADD ciphertext TEXT;
ALTER TABLE dm_messages ADD nonce TEXT;