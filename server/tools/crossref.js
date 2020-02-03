module.exports = {
  getAuthors(authorsParam) {
    if (Array.isArray(authorsParam)) {
      let authors = ""
      for (const iterator of authorsParam) {
        if (iterator._attributes.contributor_role == 'author') {
          authors += this.getAuthor(iterator) + ', '
        }
      }
      authors = authors.substr(0, authors.length - 2)
      return authors
    }else{
      return this.getAuthor(authorsParam)
    }
  },
  getAuthor(author){
    let secondName = author.surname._text.replace(' ', '-')
    let firstNames = author.given_name._text.split(' ')
    return secondName + ', ' + firstNames[0].substr(0, 1) + '.'
  }
}