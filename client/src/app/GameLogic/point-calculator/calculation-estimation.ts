export interface WordPointsEstimation {
    word: string;
    points: number;
}

export interface PlaceLetterPointsEstimation {
    wordsPoints: WordPointsEstimation[];
    totalPoints: number;
    isBingo: boolean;
}
