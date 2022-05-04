from nltk.tokenize import RegexpTokenizer
from nltk.corpus import stopwords
from nltk.stem.snowball import PorterStemmer
import nltk
import sys
#nltk.download('stopwords')

keywords = sys.argv[1]

def doTokenisation(text):
    tokenizer = RegexpTokenizer("[a-zA-Z+-]+")
    tokens = tokenizer.tokenize(text)
    return tokens

def doStemming(tokens):
    ps = PorterStemmer()
    stemmed_tokens = []
    for w in tokens:
        stemmed_tokens.append(ps.stem(w))
    
    return stemmed_tokens

def allInOneFunction(text):
    tokens = doTokenisation(text)
    stemmed_tokens = doStemming(tokens)
    return stemmed_tokens

text = keywords.split(',')
useful_text = ''
for word in text:
    if (len(word) < 1):
        pass
    result=allInOneFunction(word.lower())
    f=0
    for word in result:
        f=1
        useful_text = useful_text + ' ' + word
    if f==1:
        useful_text += ','

print(useful_text)