// src/utils/repairStatus.ts
export function markRepaired(deviceId: number) {
    localStorage.setItem(`repaired_${deviceId}`, 'true');
  }
  export function isRepaired(deviceId: number): boolean {
    return localStorage.getItem(`repaired_${deviceId}`) === 'true';
  }
  