export async function loadWasmCalendar(source) {
    let instance;
    if (source instanceof WebAssembly.Module)
        instance = await WebAssembly.instantiate(source, {});
    else if (typeof Response !== 'undefined' && source instanceof Response) {
        const result = await WebAssembly.instantiate(await source.arrayBuffer(), {});
        instance = result instanceof WebAssembly.Instance ? result : result.instance;
    }
    else {
        const result = await WebAssembly.instantiate(source, {});
        instance = result instanceof WebAssembly.Instance ? result : result.instance;
    }
    const wasm = instance.exports;
    const abi = wasm.abiVersion();
    if (abi !== 1)
        throw new Error(`Unsupported WASM calendar ABI: ${abi}`);
    return {
        abiVersion: abi,
        julianDay: (day, month, year) => wasm.julianDay(day, month, year),
        solarToLunar: (day, month, year, timezoneHours = 7) => {
            const raw = wasm.solarToLunarPacked(day, month, year, timezoneHours);
            const leap = (raw & 1n) === 1n, value = Number(raw >> 1n);
            return { day: value % 100, month: Math.floor(value / 100) % 100, year: Math.floor(value / 10000), leap };
        },
        equationOfTimeMinutes: day => wasm.equationOfTimeMinutes(day)
    };
}
