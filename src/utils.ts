import * as request from "request-promise-native";

export async function getJsonObject(method: string, params: { [key: string]: string; }) {
    let baseUrl = 'https://api.stackexchange.com/2.2/' + method;
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
