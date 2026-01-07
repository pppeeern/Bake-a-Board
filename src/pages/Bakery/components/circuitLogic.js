
// Helper to get all connected nodes
// connections is array of {from, to}
// returns a Map where key = pinID, value = netID (int)

export const buildNets = (connections) => {
    const parent = new Map();

    const find = (i) => {
        if (!parent.has(i)) parent.set(i, i);
        if (parent.get(i) !== i) parent.set(i, find(parent.get(i)));
        return parent.get(i);
    };

    const union = (i, j) => {
        const rootI = find(i);
        const rootJ = find(j);
        if (rootI !== rootJ) {
            parent.set(rootI, rootJ);
        }
    };

    // 1. Process breadboard internal connections (Rows and Rails)
    // Rows: 1-30, A-E are connected. F-J are connected.
    // We can represent holes as strings: "A1", "B1" ...

    // Power Rails
    // Right side (top in code view, often? No, look at Breadboard.jsx)
    // Left side: +, - columns.
    // Breadboard code has:
    // Left Vol: "+" cols 1-5 (multiple blocks) -> usually all connected vertical or in chunks.
    // Looking at Breadboard.jsx:
    // "bb_vol" div. 
    // Arrays of 5 pins.
    // Usually standard breadboards: +/- rails run the full length (or half). 
    // Let's assume full length for simple simulation or per-segment?
    // Breadboard.jsx renders them as chunks of 5, but visually they look like rails.
    // Let's treat all "+" on one side as connected, and all "-" as connected.
    // Left Side (+, -)
    // Right Side (+, -) -> Wait, code has top/bot layout?
    // Breadboard.jsx:
    // <div className="bb_vol"> (Left side? or Top?)
    // It renders BEFORE bb_part top.
    // Then bb_part top (A-E)
    // Then bb_part bot (F-J)
    // Then bb_vol (Right side? or Bottom?)

    // Let's standardize node names based on Breadboard.jsx pin IDs.
    // Pins are generated as:
    // Left Vol: "+1" to "+25", "-1" to "-25" (row is "+"/"-", col index involved)
    // Top Vol: row in ["+", "-"]
    //   Loop i=0..4 (blocks), col=0..4. ID = `${row}${i*5 + col + 1}`
    //   Indices: 1 to 25.
    //   So we have "+1"..." +25" and "-1"..."-25".
    //   Assume all "+X" are connected. Assume all "-X" are connected.

    // Bottom Vol (Right side?):
    //   ID = `${row}${i*5 + col + 26}`
    //   So "+26" to "+50".
    //   Let's assume these are a separate rail set? Or same? usually separate on physical boards unless jumpered.
    //   I'll treat them as separate rails: "LeftPower+", "LeftPower-", "RightPower+", "RightPower-".

    // Rows: "A" to "E" + col (1-30).
    //   "A1", "B1", "C1", "D1", "E1" are connected. ("Row1_Top")
    // Rows: "F" to "J" + col (1-30).
    //   "F1"..."J1" are connected. ("Row1_Bot")

    // 2. Logic to unify breadboard nodes
    const unifyBreadboard = () => {
        // Left Rails (1-25)
        for (let i = 1; i < 25; i++) {
            union(`+${i}`, `+${i + 1}`);
            union(`-${i}`, `-${i + 1}`);
        }
        // Right Rails (26-50)
        for (let i = 26; i < 50; i++) {
            union(`+${i}`, `+${i + 1}`);
            union(`-${i}`, `-${i + 1}`);
        }

        // Main Area Rows (1-30)
        for (let col = 1; col <= 30; col++) {
            // Top block A-E
            union(`A${col}`, `B${col}`);
            union(`B${col}`, `C${col}`);
            union(`C${col}`, `D${col}`);
            union(`D${col}`, `E${col}`);

            // Bot block F-J
            union(`F${col}`, `G${col}`);
            union(`G${col}`, `H${col}`);
            union(`H${col}`, `I${col}`);
            union(`I${col}`, `J${col}`);
        }
    };

    unifyBreadboard();

    // 3. Process User Wires/Connections
    connections.forEach(conn => {
        // conn.from/to could be component pins like "Battery 5V (VCC)" or board pins "A1"
        if (conn.from && conn.to) {
            union(conn.from, conn.to);
        }
    });

    return {
        find, // function to get net ID
        nets: parent
    };
};

export const checkCircuit = (components, connections) => {
    const { find } = buildNets(connections);

    // Identify Power Sources
    const voltageSources = [];
    components.forEach(comp => {
        if (comp.name.includes("Battery")) {
            // Assume pins are "Battery 5V (VCC)" and "Battery 5V (GND)"
            // Dynamic naming based on ID?
            // Electronics.jsx: VCC = "Battery 5V (VCC)"
            // If multiple batteries, might need unique logic.
            // But currently simple string matching.
            voltageSources.push({
                vcc: "Battery 5V (VCC)",
                gnd: "Battery 5V (GND)",
                volts: 5
            });
        }
    });

    // Determine state of components
    const componentStates = {};

    components.forEach(comp => {
        if (comp.name === "LED") {
            const anode = "LED (Anode)";
            const cathode = "LED (Cathode)";

            // Check if connected to a valid power source
            let isPowered = false;

            voltageSources.forEach(src => {
                const vccNet = find(src.vcc);
                const gndNet = find(src.gnd);

                const anodeNet = find(anode);
                const cathodeNet = find(cathode);

                // Simple logic: Anode to VCC, Cathode to GND
                if (anodeNet === vccNet && cathodeNet === gndNet) {
                    isPowered = true;
                }
            });

            componentStates[comp.id] = { isPowered };
        }
    });

    return componentStates;
};
