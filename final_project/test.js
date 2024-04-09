let books = {
    1: {"author": "Chinua Achebe","title": "Things Fall Apart", "reviews": {'igor': 'Good book'} },
    2: {"author": "Hans Christian Andersen","title": "Fairy tales", "reviews": {} },
    3: {"author": "Dante Alighieri","title": "The Divine Comedy", "reviews": {} },
    4: {"author": "Unknown","title": "The Epic Of Gilgamesh", "reviews": {} },
    5: {"author": "Unknown","title": "The Book Of Job", "reviews": {} },
    6: {"author": "Unknown","title": "One Thousand and One Nights", "reviews": {} },
    7: {"author": "Unknown","title": "Nj\u00e1l's Saga", "reviews": {} },
    8: {"author": "Jane Austen","title": "Pride and Prejudice", "reviews": {} },
    9: {"author": "Honor\u00e9 de Balzac","title": "Le P\u00e8re Goriot", "reviews": {} },
    10: {"author": "Samuel Beckett","title": "Molloy, Malone Dies, The Unnamable, the trilogy", "reviews": {} }
}

let isbn = 1
let user = 'igor'
let review = 'terrible day'

function apagar(isbn, user, review) {
    if (user in books[isbn].reviews) {
        delete books[isbn].reviews[user]
        console.log('Review Deleted Succesfully!')
    } else {
        console.log('No reviews from this user for this book.')
    }
}

apagar(isbn, user, review)
apagar(2, user, review)
apagar(isbn, user, review)