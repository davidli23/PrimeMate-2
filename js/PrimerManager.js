import {BOUNDS, BLOCK_SIZE} from './util.js';
import {PrimerPair} from './PrimerPair.js';

/**
 * Manager class in charge of creating, storing, and manipulating the primer pairs
 */
export class PrimerManager {
    allBlocksGenerated = false;
    selectedPrimerPair = -1;
    favorites = new Set();

    #params;
    #weights = {
        tempDiff: 20,
        indMeltTemp: 20,
        GCContent: 20,
        length: 20,
        clamps: 20,
    };
    #scoreBounds = BOUNDS;
    #blockSize = BLOCK_SIZE;
    #currentIndex = 0;

    #allPrimerPairs = [];
    #allPrimerPairsById = [];
    #primerPairsBlocks = [];

    #exons = [];

    /**
     * @returns {{
     *     	forward: {
     *     		exon: number
     *         	segments: string[]
     *     	},
     *     	reverse: {
     *     		exon: number
     *         	segments: string[]
     *     	},
     * } | null}
     */
    splitSelectedExons() {
        if (this.selectedPrimerPair < 0) {
            return null;
        }
        const primerPair = this.#allPrimerPairsById[this.selectedPrimerPair];
        return {
            forward: {
                exon: primerPair.fPrimer.exonNumber,
                segments: [
                    this.#exons[primerPair.fPrimer.exonNumber].substring(0, primerPair.fPrimer.location.start),
                    this.#exons[primerPair.fPrimer.exonNumber].substring(primerPair.fPrimer.location.start, primerPair.fPrimer.location.end),
                    this.#exons[primerPair.fPrimer.exonNumber].substring(primerPair.fPrimer.location.end)
                ],
            },
            reverse: {
                exon: primerPair.rPrimer.exonNumber,
                segments: [
                    this.#exons[primerPair.rPrimer.exonNumber].substring(0, primerPair.rPrimer.location.start),
                    this.#exons[primerPair.rPrimer.exonNumber].substring(primerPair.rPrimer.location.start, primerPair.rPrimer.location.end),
                    this.#exons[primerPair.rPrimer.exonNumber].substring(primerPair.rPrimer.location.end)
                ]
            }
        }
    }

    /**
     * @returns {{
     *     	forward: {
     *     		exon: number
     *         	sequence: string
     *     	},
     *     	reverse: {
     *     		exon: number
     *         	sequence: string
     *     	},
     * } | null}
     */
    joinSelectedExons() {
        if (this.selectedPrimerPair < 0) {
            return null;
        }
        const primerPair = this.#allPrimerPairsById[this.selectedPrimerPair];
        return {
            forward: {
                exon: primerPair.fPrimer.exonNumber,
                sequence: this.#exons[primerPair.fPrimer.exonNumber]
            },
            reverse: {
                exon: primerPair.rPrimer.exonNumber,
                sequence: this.#exons[primerPair.rPrimer.exonNumber]
            }
        }
    }

    /**
     * Runs algorithm that finds primer pairs and sets allPrimerPairs
     * @param {Array<string>} exons Array of the exons as strings
     * @param {Array<number>} introns Array of intron lengths
     * @param {Object} params Params object
     */
    generatePrimerPairs(exons, introns, params) {
        this.#params = params;
        this.#exons = exons;
        this.#allPrimerPairs = this.#findPrimers(exons, introns, params);
    }

    /**
     * @returns {{
     *     array: PrimerPair[]
     *     startIndex: number
     * }}
     */
    generateNextBlock() {
        let block = [];
        let i = 0;
        while (i < this.#blockSize) {
            if (this.#currentIndex >= this.#allPrimerPairs.length) {
                this.allBlocksGenerated = true;
                break;
            }
            let primerPair = this.#allPrimerPairs[this.#currentIndex];
            primerPair.setDimerization(this.#params.dimerThresh);
            primerPair.setHairpins(this.#params.dimerThresh);
            if (!primerPair.dimerizes && !primerPair.fPrimer.hairpin && !primerPair.rPrimer.hairpin) {
                block.push(primerPair);
                i += 1;
            }
            this.#currentIndex += 1;
        }
        if (block.length > 0) {
            this.#primerPairsBlocks.push(block);
        }
        return {
            array: block,
            startIndex: this.#blockSize * (this.#primerPairsBlocks.length - 1)
        };
    }

    /**
     * Main algorithm for finding primers
     * @param {Array} exons Array of the exons as strings
     * @param {Array} introns Array of intron lengths
     * @param {Object} params Params object
     * @returns {Array} Array of PrimerPair objects sorted from highest score to lowest score
     */
    #findPrimers(exons, introns, params) {
        let distBounds = {
            min: Math.floor(
                (params.length.total - params.length.upper - params.length.lower) / 2
            ),
            max: Math.ceil(
                (3 *
                    (params.length.total - params.length.upper - params.length.lower)) /
                2
            ),
        };
        let primerPairs = [];
        let i = 0;
        exons.forEach((exon, exonNumber) => {
            // Check if first or last exon
            // if (
            // 	(1 <= exonNumber && exonNumber < exons.length - 1) ||
            // 	(exons.length <= 3 && exonNumber == 0)
            // ) {
            if (
                (1 <= exonNumber && exonNumber < 3) ||
                (exons.length <= 3 && exonNumber === 0)
            ) {
                // Loop through each starting index, taking the best pair with that starting index
                for (
                    let fStart = Math.max(
                        0,
                        exon.length - distBounds.max - params.length.upper
                    );
                    fStart <= exon.length - params.length.lower;
                    fStart++
                ) {
                    let primerPair = this.#bestPrimerPair(
                        exons,
                        exonNumber,
                        fStart,
                        params,
                        distBounds
                    );
                    if (primerPair != null) {
                        primerPairs.push(primerPair);
                        primerPair.id = i;
                        i += 1;
                    }
                }
            }
        });
        this.#allPrimerPairsById = [...primerPairs];
        primerPairs.sort((p1, p2) => {
            return p2.scores.total - p1.scores.total;
        });
        return primerPairs;
    }

    #bestPrimerPair(exons, exonNumber, fStart, params, distBounds) {
        let bestPrimerPair = null;
        let bestScore = 0;

        // Loop through each possible primer pair
        for (
            let fEnd = fStart + params.length.lower;
            fEnd <= Math.min(exons[exonNumber].length, fStart + params.length.upper);
            fEnd++
        ) {
            for (
                let rStart = Math.max(
                    0,
                    distBounds.min - (exons[exonNumber].length - fEnd)
                );
                rStart <
                Math.min(
                    exons[exonNumber + 1].length - params.length.lower,
                    distBounds.max - (exons[exonNumber].length - fEnd) + 1
                );
                rStart++
            ) {
                for (
                    let rEnd = rStart + params.length.lower;
                    rEnd <=
                    Math.min(exons[exonNumber + 1].length, rStart + params.length.upper);
                    rEnd++
                ) {
                    let primerPair = new PrimerPair(
                        exons,
                        exonNumber,
                        {start: fStart, end: fEnd},
                        {start: rStart, end: rEnd}
                    );
                    primerPair.calculateScores(params, this.#scoreBounds, this.#weights);
                    if (primerPair.scores.total > bestScore) {
                        bestPrimerPair = primerPair;
                        bestScore = primerPair.scores.total;
                    }
                }
            }
        }
        return bestPrimerPair;
    }
}
