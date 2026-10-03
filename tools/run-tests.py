import json
import os, io, sys, traceback

labs = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'labs.json'), encoding='utf-8'))
only = sys.argv[1] if len(sys.argv) > 1 else None
fail_total = 0

for lab in labs:
    if only and lab['id'] != only:
        continue
    base = lab['solution']
    if not base.strip():
        print('SKIP (sin solucion): ' + lab['id'])
        continue
    # 1) la solucion debe correr sola
    try:
        exec(compile(base, lab['id'] + ':sol', 'exec'), {'__name__': '__main__'})
    except Exception:
        print('FALLA AL EJECUTAR LA SOLUCION: ' + lab['id'])
        traceback.print_exc()
        fail_total += 1
        continue
    # 2) cada test en un namespace fresco con la solucion
    ok = 0
    for k, t in enumerate(lab['tests']):
        ns = {'__name__': '__main__'}
        try:
            exec(compile(base, lab['id'], 'exec'), ns)
            exec(compile(t['code'], lab['id'] + ':t' + str(k), 'exec'), ns)
            ok += 1
        except Exception as e:
            fail_total += 1
            print('  FALLA ' + lab['id'] + ' [' + str(k + 1) + '/' + str(len(lab['tests'])) + '] ' + t['name'])
            print('       ' + type(e).__name__ + ': ' + str(e))
    print(('OK   ' if ok == len(lab['tests']) else 'PARCIAL ') + lab['id'] + '  ' + str(ok) + '/' + str(len(lab['tests'])) + '  ' + lab['title'][:60])

print('')
print('FALLAS TOTALES: ' + str(fail_total))