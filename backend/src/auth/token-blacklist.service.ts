import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenBlacklistService {
  private blacklistedTokens: Set<string> = new Set();

  addToken(token: string) {
    this.blacklistedTokens.add(token);
  }

  isBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }
}
