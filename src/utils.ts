import * as request from "request-promise-native";

export async function getJsonObject(params: { [key: string]: string; }) {
    const baseUrl = 'https://api.stackexchange.com/2.2/search';
    let queryStrings: string[] = [];
    for (let i in params) {
        queryStrings.push(encodeURI(i + '=' + params[i]))
    }
    var options = {
        uri: baseUrl + '?' + queryStrings.join('&'),
        gzip: true
    };
    let response = await request.get(options);
    return JSON.parse(response);
}
