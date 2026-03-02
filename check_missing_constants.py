#!/usr/bin/env python3
"""
Compares current .opy constant files against newly generated ones.
Outputs two text files listing constants present in the current files
but missing in the generated ones (with their full definition line).
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent

CURRENT = {
    'ow1': ROOT / 'src/constants/ow1_constants.opy',
    'ow2': ROOT / 'src/constants/ow2_constants.opy',
}
GENERATED = {
    'ow1': ROOT / 'constant-generator/generated_constants/ow1_constants.opy',
    'ow2': ROOT / 'constant-generator/generated_constants/ow2_constants.opy',
}
OUTPUT = {
    'ow1': ROOT / 'missing_from_ow1_generated.txt',
    'ow2': ROOT / 'missing_from_ow2_generated.txt',
}

DEFINE_RE  = re.compile(r'^#!define\s+(\w+)\s+(.+)')
GLOBALVAR_RE = re.compile(r'^globalvar\s+(\w+)\s*=\s*(.+)')


def parse_constants(path: Path) -> dict[str, str]:
    """Return {name: full_line} for every constant definition, skipping comments."""
    constants = {}
    for raw in path.read_text(encoding='utf-8').splitlines():
        line = raw.strip()
        if not line:
            continue
        # Skip pure comment lines (# but not #!)
        if line.startswith('#') and not line.startswith('#!'):
            continue
        m = DEFINE_RE.match(line) or GLOBALVAR_RE.match(line)
        if m:
            constants[m.group(1)] = line
    return constants


def main():
    for variant in ('ow1', 'ow2'):
        current_path   = CURRENT[variant]
        generated_path = GENERATED[variant]

        if not current_path.exists():
            print(f'WARNING: {current_path} not found, skipping.')
            continue
        if not generated_path.exists():
            print(f'WARNING: {generated_path} not found, skipping.')
            continue

        current   = parse_constants(current_path)
        generated = parse_constants(generated_path)

        missing = {name: line for name, line in current.items() if name not in generated}

        out_path = OUTPUT[variant]
        with out_path.open('w', encoding='utf-8') as f:
            f.write(f'Constants in {current_path.relative_to(ROOT)}\n')
            f.write(f'missing from {generated_path.relative_to(ROOT)}\n')
            f.write(f'{"=" * 60}\n\n')
            if missing:
                for name, line in sorted(missing.items()):
                    f.write(f'{line}\n')
            else:
                f.write('(none — all constants are present in the generated file)\n')

        print(f'{variant.upper()}: {len(missing)} missing → {out_path.name}')
        for name in sorted(missing):
            print(f'  - {name}')


if __name__ == '__main__':
    main()
