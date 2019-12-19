import * as utils from './utils';

interface SearchPageJson {
    items: QuestionJson[];
    has_more: boolean;
    page: number;
    total: number;
}

interface AnswersJson {
    items: AnswerJson[];
    has_more: boolean;
    page: number;
    total: number;
}

interface QuestionJson {
    question_id: number;
    score: number;
    title: string;
    link: string;
    is_answered: boolean;
    answer_count: number;
    accepted_answer_id?: number;
    creation_date: number;
    last_activity_date: number;
    view_count: number;
    tags: string[];
    body: string;
    owner: OwnerJson;
    answers: AnswerJson[];
}

interface OwnerJson {
    reputation: number;
    user_id: number;
    user_type: string;
    accept_rate: number;
    profile_image: string;
    display_name: string;
    link: string;
}

interface AnswerJson {
    owner: OwnerJson;
    is_accepted: boolean;
    score: number;
    last_activity_date: number;
    creation_date: number;
    answer_id: number;
    question_id: number;
    body: string;
}

class SearchResult {
    id!: number;
    score!: number;
    title!: string;
    link!: string;
    isAnswered!: boolean;
    answerCount!: number;
    acceptedAnswerid?: number;
    askedDate!: Date;
    activeDate!: Date;
    viewedTimes!: number;
    tags!: string[];
    body!: string;
    owner!: Owner;
    answers!: Answer[];

    constructor(jsonObject: QuestionJson) {
        this.id = jsonObject.question_id;
        this.score = jsonObject.score;
        this.title = jsonObject.title;
        this.link = jsonObject.link;
        this.isAnswered = jsonObject.is_answered;
        this.answerCount = jsonObject.answer_count;
        this.acceptedAnswerid = jsonObject.accepted_answer_id;
        this.askedDate = new Date(jsonObject.creation_date * 1000);
        this.activeDate = new Date(jsonObject.last_activity_date * 1000);
        this.viewedTimes = jsonObject.view_count;
        this.tags = jsonObject.tags;
        this.body = jsonObject.body;
        this.owner = new Owner(jsonObject.owner);
        this.answers = []
        for (let i in jsonObject.answers) {
            this.answers.push(new Answer(jsonObject.answers[i]));
        }
    }

    addAnswer(answer: Answer) {
        this.answers.push(answer)
    }
}

class Owner {
    id!: number;
    displayName!: string;
    profileImage!: string;
    reputation!: number;
    link!: string;

    constructor(jsonObject: OwnerJson) {
        this.id = jsonObject.user_id;
        this.displayName = jsonObject.display_name;
        this.profileImage = jsonObject.profile_image;
        this.reputation = jsonObject.reputation;
        this.link = jsonObject.link; ``
    }
}

class Answer {
    answerId!: number;
    body!: string;
    isAccepted!: boolean;
    score!: number;
    lastActivityDate!: Date;
    creationDate!: Date;
    owner!: Owner;

    constructor(jsonObject: AnswerJson) {
        this.answerId = jsonObject.answer_id;
        this.body = jsonObject.body;
        this.score = jsonObject.score;
        this.isAccepted = jsonObject.is_accepted;
        this.lastActivityDate = new Date(jsonObject.last_activity_date * 1000);
        this.creationDate = new Date(jsonObject.creation_date);
        this.owner = new Owner(jsonObject.owner);
    }
}

export class SearchPage {
    query: string;
    results: SearchResult[];
    totalResults: number;
    currentPage: number;
    hasMore: boolean;
    private constructor(query: string, apiResposeObject: SearchPageJson) {
        this.query = query;
        this.totalResults = apiResposeObject.total;
        this.currentPage = apiResposeObject.page;
        this.hasMore = apiResposeObject.has_more;
        this.results = []
        for (let i in apiResposeObject.items) {
            this.results.push(new SearchResult(apiResposeObject.items[i]))
        }
    }


    static async search(query: string, pageNumber: number = 1) {
        let params: { [key: string]: string; } = {};
        params['page'] = pageNumber.toString();
        params['pagesize'] = '5';
        params['order'] = 'desc';
        params['sort'] = 'votes';
        params['intitle'] = query;
        params['site'] = 'stackoverflow';
        params['filter'] = '!b1MMEUbuR7EV6a';
        let response = await utils.getJsonObject('search', params)

        let searchPage = new SearchPage(query, response);

        // чтобы уменьшить количество запросов, все ответы загружаются за раз 
        let answerIds: number[] = [];
        for (let i in searchPage.results) {
            if (searchPage.results[i].acceptedAnswerid == undefined) {
                continue;
            }
            answerIds.push(searchPage.results[i].acceptedAnswerid!);
        }
        params = {};
        params['order'] = 'desc';
        params['sort'] = 'activity';
        params['site'] = 'stackoverflow';
        let answersResponse: AnswersJson = await utils.getJsonObject('answers/' + answerIds.join(';'), params);
        for (let i in answersResponse.items) {
            for (let j in searchPage.results) {
                if (searchPage.results[j].id == answersResponse.items[i].question_id) {
                    searchPage.results[j].addAnswer(new Answer(answersResponse.items[i]));
                }
            }
        }

        return searchPage;
    }
}