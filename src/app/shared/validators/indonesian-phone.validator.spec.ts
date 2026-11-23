import { FormControl } from '@angular/forms';
import { indonesianPhone } from './indonesian-phone.validator';

describe('indonesianPhone', () => {
  const validator = indonesianPhone();
  const run = (value: string) => validator(new FormControl(value));

  it('menerima format 08xx', () => {
    expect(run('081234567890')).toBeNull();
  });

  it('menerima format +62 dan 62', () => {
    expect(run('+6281234567890')).toBeNull();
    expect(run('6281234567890')).toBeNull();
  });

  it('mengabaikan spasi dan tanda hubung', () => {
    expect(run('0812-3456-7890')).toBeNull();
    expect(run('0812 3456 7890')).toBeNull();
  });

  it('menolak nomor tidak valid', () => {
    expect(run('123')).toEqual({ indonesianPhone: true });
    expect(run('0712345678')).toEqual({ indonesianPhone: true });
  });

  it('membiarkan nilai kosong (urusan Validators.required)', () => {
    expect(run('')).toBeNull();
  });
});
