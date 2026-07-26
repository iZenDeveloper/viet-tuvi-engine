#!/usr/bin/env node
import { calculateTuVi, serializeChart, capabilities, validateInput } from './index.js';
const raw = process.argv[2];
if (raw === '--version' || raw === '-v') {
    console.log(capabilities().version);
}
else if (raw === '--capabilities') {
    console.log(JSON.stringify(capabilities()));
}
else if (raw === '--help' || raw === '-h') {
    console.log('Usage: viet-tuvi \'<calculate-input-json>\'');
    console.log('       viet-tuvi --capabilities');
    console.log('       viet-tuvi --version');
}
else if (!raw) {
    console.error('Usage: viet-tuvi \'<calculate-input-json>\'');
    process.exitCode = 2;
}
else {
    try {
        console.log(serializeChart(calculateTuVi(JSON.parse(raw))));
    }
    catch (e) {
        const input = (() => { try {
            return JSON.parse(raw);
        }
        catch {
            return null;
        } })();
        console.error(JSON.stringify({ error: e instanceof Error ? e.message : 'Invalid input', validation: validateInput(input) }));
        process.exitCode = 1;
    }
}
