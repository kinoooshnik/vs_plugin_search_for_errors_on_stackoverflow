class SearchResult {
    rating!: number;
    title!: string;
    url!: string;
}

class Comment {
    text!: string;
    author!: string;
}

class Block {
    rating!: number;
    text!: string;
    comments!: Comment[];
    author!: string;
}

class AnswerPage {
    url!: string;
    title!: string;
    askedDate!: Date;
    activeDate!: Date;
    viewedTimes!: number;
    tags!: string[];
    quastion!: Block;
    answers!: Block[];
}