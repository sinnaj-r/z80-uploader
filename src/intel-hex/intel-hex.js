/**
 * writer for the "Intel hex" format.
 */

// Takes two Uint8Arrays as input,
// Returns an integer in the 0-255 range.
function checksumTwo(array1, array2) {
    const partial1 = array1.reduce((sum, v) => sum + v, 0);
    const partial2 = array2.reduce((sum, v) => sum + v, 0);
    return -(partial1 + partial2) & 0xff;
}

// Trivial utility. Converts a number to hex and pads with zeroes up to 2 characters.
function hexpad(number) {
    return number.toString(16).toUpperCase().padStart(2, "0");
}

/**
 * @class MemoryMap
 *
 * Represents the contents of a memory layout, with main focus into (possibly sparse) blocks of data.
 *<br/>
 * A {@linkcode MemoryMap} acts as a subclass of
 * {@linkcode https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map|Map}.
 * In every entry of it, the key is the starting address of a data block (an integer number),
 * and the value is the <tt>Uint8Array</tt> with the data for that block.
 *<br/>
 * The main rationale for this is that a .hex file can contain a single block of contiguous
 * data starting at memory address 0 (and it's the common case for simple .hex files),
 * but complex files with several non-contiguous data blocks are also possible, thus
 * the need for a data structure on top of the <tt>Uint8Array</tt>s.
 *<br/>
 * In order to parse <tt>.hex</tt> files, use the {@linkcode MemoryMap.fromHex} <em>static</em> factory
 * method. In order to write <tt>.hex</tt> files, create a new {@linkcode MemoryMap} and call
 * its {@linkcode MemoryMap.asHexString} method.
 *
 * @extends Map
 * @example
 * import MemoryMap from 'nrf-intel-hex';
 *
 * let memMap1 = new MemoryMap();
 * let memMap2 = new MemoryMap([[0, new Uint8Array(1,2,3,4)]]);
 * let memMap3 = new MemoryMap({0: new Uint8Array(1,2,3,4)});
 * let memMap4 = new MemoryMap({0xCF0: new Uint8Array(1,2,3,4)});
 */
class MemoryMap {
    /**
     * @param {Iterable} blocks The initial value for the memory blocks inside this
     * <tt>MemoryMap</tt>. All keys must be numeric, and all values must be instances of
     * <tt>Uint8Array</tt>. Optionally it can also be a plain <tt>Object</tt> with
     * only numeric keys.
     */
    constructor() {
        this._blocks = new Map();
    }

    set(addr, value) {
        if (!Number.isInteger(addr)) {
            throw new Error("Address passed to MemoryMap is not an integer");
        }
        if (addr < 0) {
            throw new Error("Address passed to MemoryMap is negative");
        }
        if (!(value instanceof Uint8Array)) {
            throw new Error("Bytes passed to MemoryMap are not an Uint8Array");
        }
        return this._blocks.set(addr, value);
    }
    // Delegate the following to the 'this._blocks' Map:
    get(addr) {
        return this._blocks.get(addr);
    }
    clear() {
        return this._blocks.clear();
    }
    delete(addr) {
        return this._blocks.delete(addr);
    }
    entries() {
        return this._blocks.entries();
    }
    forEach(callback, that) {
        return this._blocks.forEach(callback, that);
    }
    has(addr) {
        return this._blocks.has(addr);
    }
    keys() {
        return this._blocks.keys();
    }
    values() {
        return this._blocks.values();
    }
    get size() {
        return this._blocks.size;
    }
    [Symbol.iterator]() {
        return this._blocks[Symbol.iterator]();
    }

    /**
     * Returns a <tt>String</tt> of text representing a .hex file.
     * <br/>
     * The writer has an opinionated behaviour. Check the project's
     * {@link https://github.com/NordicSemiconductor/nrf-intel-hex#Features|README file} for details.
     *
     * @param {Number} [lineSize=16] Maximum number of bytes to be encoded in each data record.
     * Must have a value between 1 and 255, as per the specification.
     *
     * @return {String} String of text with the .hex representation of the input binary data
     *
     * @example
     * import MemoryMap from 'nrf-intel-hex';
     *
     * let memMap = new MemoryMap();
     * let bytes = new Uint8Array(....);
     * memMap.set(0x0FF80000, bytes); // The block with 'bytes' will start at offset 0x0FF80000
     *
     * let string = memMap.asHexString();
     */

    //TODO In Settings einstellbar machen
    asHexString(lineSize = 16) {
        let highAddress = -1 << 16; // 16 most significant bits of the current addr
        const records = [];
        if (lineSize <= 0) {
            throw new Error("Size of record must be greater than zero");
        } else if (lineSize > 255) {
            throw new Error("Size of record must be less than 256");
        }

        // Placeholders
        const recordHeader = new Uint8Array(4);

        const sortedKeys = Array.from(this.keys()).sort((a, b) => a - b);
        for (let i = 0, l = sortedKeys.length; i < l; i++) {
            const blockAddr = sortedKeys[i];
            highAddress = blockAddr;
            const block = this.get(blockAddr);

            // Sanity checks
            if (!(block instanceof Uint8Array)) {
                throw new Error(
                    "Block at offset " + blockAddr + " is not an Uint8Array"
                );
            }
            if (blockAddr < 0) {
                throw new Error(
                    "Block at offset " +
                        blockAddr +
                        " has a negative thus invalid address"
                );
            }
            const blockSize = block.length;
            if (!blockSize) {
                continue;
            } // Skip zero-length blocks

            if (blockAddr < highAddress) {
                throw new Error(
                    "Block starting at 0x" +
                        blockAddr.toString(16) +
                        " overlaps with a previous block."
                );
            }

            let blockOffset = 0;
            const blockEnd = blockAddr + blockSize;
            if (blockEnd > 0xffffffff) {
                throw new Error("Data cannot be over 0xFFFFFFFF");
            }

            // Loop for every 64KiB memory segment that spans this block
            while (highAddress < blockEnd) {
                // Loop for every record for that spans the current 64KiB memory segment
                let recordSize = Math.min(
                    lineSize, // Normal case
                    blockEnd - highAddress // End of block
                );

                recordHeader[0] = recordSize; // Length
                recordHeader[1] = highAddress;
                recordHeader[3] = 0; // Record type

                const subBlock = block.subarray(
                    blockOffset,
                    blockOffset + recordSize
                ); // Data bytes for this record

                records.push(
                    ":" +
                        Array.prototype.map
                            .call(recordHeader, hexpad)
                            .join("") +
                        Array.prototype.map.call(subBlock, hexpad).join("") +
                        hexpad(checksumTwo(recordHeader, subBlock))
                );

                blockOffset += recordSize;
                highAddress += recordSize;
            }
        }

        records.push(":00000001FF"); // EOF record

        return records.join("\n");
    }
}

export default MemoryMap;
