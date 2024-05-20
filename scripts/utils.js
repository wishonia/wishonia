function titleCase(str){
    return str.toLowerCase().split(' ').map(function(word) {
        if (!word) return '';
        return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
}

module.exports = {
    titleCase,
};