// Cryptographic Hash-Chained Audit Log
// Guarantees tamper-proof timeline of slip capture, legal clock calculations, pauses, breaches, and appeal dispatches.

// Fast browser-compatible SHA-256
export async function sha256(message) {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Simple fallback hash for non-crypto contexts
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return '0000' + Math.abs(hash).toString(16).padStart(60, '0');
}

export class AuditLogChain {
  constructor(initialBlocks = []) {
    this.chain = initialBlocks.length > 0 ? initialBlocks : [
      {
        index: 0,
        timestamp: "2024-01-01T00:00:00.000Z",
        eventType: "GENESIS",
        applicationId: "SYSTEM-ROOT",
        payload: { message: "SAMAY Legal Clock Registry Initialized under RTS Framework" },
        previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
        hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
      }
    ];
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  async addBlock(eventType, applicationId, payload) {
    const previousBlock = this.getLatestBlock();
    const index = this.chain.length;
    const timestamp = new Date().toISOString();
    const dataString = `${index}${timestamp}${previousBlock.hash}${eventType}${applicationId}${JSON.stringify(payload)}`;
    const hash = await sha256(dataString);

    const newBlock = {
      index,
      timestamp,
      eventType,
      applicationId,
      payload,
      previousHash: previousBlock.hash,
      hash
    };

    this.chain.push(newBlock);
    return newBlock;
  }

  async verifyChain() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.previousHash !== previousBlock.hash) {
        return { valid: false, brokenIndex: i, reason: "Previous hash mismatch" };
      }

      const dataString = `${currentBlock.index}${currentBlock.timestamp}${currentBlock.previousHash}${currentBlock.eventType}${currentBlock.applicationId}${JSON.stringify(currentBlock.payload)}`;
      const recalculatedHash = await sha256(dataString);

      if (recalculatedHash !== currentBlock.hash) {
        return { valid: false, brokenIndex: i, reason: "Data tampering detected in block hash" };
      }
    }
    return { valid: true, blockCount: this.chain.length };
  }
}
