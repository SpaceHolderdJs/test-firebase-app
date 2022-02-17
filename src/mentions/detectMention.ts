const detectMention = (str: string) => {
    const mentions = str.match(/@(.*?)\)/);

    let result = str;
    
    mentions?.forEach((mention)=> { 
            const userName = str.match(/\[(.*?)\]/);
            console.log("User name", userName);
            result = result.replaceAll(mention, `<span class="mention">${userName?.at(1) || ""}</span>`);
    });

    return result;
    
}

export default detectMention;