// okay well, THIS is honestly mostly aspirational. BUT...
// At SOME point I want to port my Python Markov module (and, er, probably
// make it suck way less.) And whenever that happens, this is where it'll go.

// What sort of things would we want in a markov library?
/*
TOKENIZE interface
  should accept options for what kind of tokens to generate lol
  i.e. word or ngram based?
  should also accept an ORDER int, probably? 
which of course should produce some kind of standardized TOKENS dict(?)
it should be possible to MERGE parsed tokens dicts into a single data source ideally
if that turns out to be too much of a pain, API should at least enable reading in multiple sources
(possibly with the option to weight different sources?)
hmmm I was thinking of this for text-based goofiness but the more I try to think
of it like a general purpose problem space the more I feel like it should be more
generalized and also probably more work lmao.
*/
// IDEA: oh my GOD I should use the commented lines from my source code as a
// corpus! ...maybe with some filtering to handle punctuation from the inevitable
// commented-out actual source code, instead of notes like this one.