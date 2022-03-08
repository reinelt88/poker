const Result = { "win": 1, "loss": 2, "tie": 3 }

const type = {
    "straight_flush": 1,
    "four_kind": 2,
    "full_house": 3,
    "flush": 4,
    "straight": 5,
    "three_kind": 6,
    "two_pair": 7,
    "one_pair": 8,
    "high_card": 9,
}

const values = {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    'T': 10,
    'J': 11,
    'Q': 12,
    'K': 13,
    'A': 14
}

const stairs = [
    '14 2 3 4 5',
    '2 3 4 5 6',
    '3 4 5 6 7',
    '4 5 6 7 8',
    '5 6 7 8 9',
    '6 7 8 9 10',
    '7 8 9 10 11',
    '8 9 10 11 12',
    '9 10 11 12 13',
    '10 11 12 13 14'
]

const handSort = [];

const reducer = (acc, c) => acc + c;

function PokerHand(_hand) {
    this.hand = _hand;
}

PokerHand.prototype.compareWith = function(opponent){

    debugger;
    const yo = this.getHandType();
    const tu = opponent.getHandType();

    if (yo < tu)
        return Result.win;
    else if (yo > tu){
        return Result.loss;
    } else {
        return this.compareSameType(yo, opponent)
    }

}

PokerHand.prototype.compareSameType = function (type, opponent){

    switch (type) {
        case 1:
            return this.compareStraightFlush(opponent)
        case 2:
            return this.compareFourOfAKind(opponent)
        case 3:
            return this.compareFullHouse(opponent)
        case 4:
            return this.compareFlush(opponent)
        case 5:
            return this.compareStraight(opponent)
        case 6:
            return this.compareThreeOfaKind(opponent)
        case 7:
            return this.compareTwoPair(opponent)
        case 8:
            return this.compareOnePair(opponent)
        case 9:
            return this.compareHighCard(opponent)

    }
}

PokerHand.prototype.getValue = function(key){
    return values[key];
}

PokerHand.prototype.sortHand = function(){
    const cards = this.getCards();
    return cards.sort((a,b) => this.getValue(this.getFace(a)) > this.getValue(this.getFace(b)) ? 1 : -1);
}

PokerHand.prototype.getHandType = function(){
    if (this.isStraightFlush())
        return type.straight_flush;
    else if (this.isFourOfAKind())
        return type.four_kind;
    else if (this.isFullHouse())
        return type.full_house;
    else if (this.isFlush())
        return type.flush;
    else if (this.isStraight())
        return type.straight;
    else if (this.isThreeOfaKind())
        return type.three_kind;
    else if (this.isTwoPair())
        return type.two_pair;
    else if (this.isOnePair())
        return type.one_pair;
    else if(this.isHighCard())
        return type.high_card;

    return false;
}

PokerHand.prototype.sameFace = function(){
    const cards = this.getCards();
    return cards.every( e => this.getFace(e) === this.getFace(cards[0]));
}

PokerHand.prototype.sameSuit = function(){
    const cards = this.getCards();
    return cards.every( e => this.getSuit(e) === this.getSuit(cards[0]));
}

PokerHand.prototype.getFace = function(card){
    return card.length === 3 ? card.substr(0,2) : card[0];
}

PokerHand.prototype.getSuit = function(card){
    return card.length === 3 ? card.substr(2,3) : card[1];
}

PokerHand.prototype.getCards = function(){
    return this.hand.split(" ");
}

PokerHand.prototype.maxFace = function(){
    return this.getValue(this.getFace(this.sortHand().pop()));
}

//5S 5H 5D 7C 7C => 5
PokerHand.prototype.faceOfset = function(set){

    let map = this.mapFace();

    let result = 0;
    Object.keys(map).forEach(face => {
        if (map[face] >= set)
            result = face;
    });

    return result;
}

//5S 5H 4D JC JC => [5, 11]
PokerHand.prototype.facesOfset = function(set){

    let map = this.mapFace();

    let result = [];
    Object.keys(map).forEach(face => {
        if (map[face] >= set)
            result.push(this.getValue(face));
    });

    return result;
}

//[1,2,3,4,5], [2,3,4,5,6] => 1
//[2,3,4,5,6], [1,2,3,4,5] => 2
//[2,3,4,5,6], [2,3,4,5,6] => 0
PokerHand.prototype.highestCard = function(data1, data2){

    const c1 = data1.reduce(reducer);
    const c2 = data2.reduce(reducer);

    return c1 > c2 ? Result.win : c1 === c2 ? Result.tie : Result.loss
}

// 2S 3S 4S 5S TS => [2,3,4,5,10]
PokerHand.prototype.handValues = function(){
    return this.getCards().map( c => this.getValue(this.getFace(c)));
}

PokerHand.prototype.mapFace = function(){

    let map = {};
    let cards = this.getCards();

    cards.forEach(e => {

        let suit = this.getFace(e);
        if (map[suit] !== undefined){
            map[suit]++
        } else {
            map[suit] = 1;
        }

    });

    return map

}

PokerHand.prototype.isSequential = function(){
    return stairs.includes(this.handValues().sort().join(' ')) && Object.keys(this.mapFace()).length === 5;
}

PokerHand.prototype.convertHandToNumber = function(hand){
    handSort.splice(0, handSort.length);
    const cards = this.getCards();
    for(let i = 0; i < 5; i++) {
        handSort.push(this.getValue(this.getFace(cards[i])));
    }
}

PokerHand.prototype.countPairsOrTrios = function( type){
    const map = this.mapFace();
    const num = (type === 'p') ? 2 : 3;
    let count = 0;
    for (const prop in map)
        if (map[prop] === num)
            count++;
    return count;
}

/**
 * SAME PLAYS COMPARATOR
 */
PokerHand.prototype.compareStraightFlush = function(opponent){

    let yo = this.handValues().sort().join(' ');
    let tu = opponent.handValues().sort().join(' ');

    let i = stairs.indexOf(yo);
    let j = stairs.indexOf(tu);

    return  i > j ? Result.win : i === j ? Result.tie : Result.loss

}

PokerHand.prototype.compareFourOfAKind = function(opponent){

    const face1 = this.getValue(this.faceOfset(4));
    const face2 = this.getValue(opponent.faceOfset(4));

    let result =  face1 > face2 ? Result.win : face1 === face2 ? Result.tie : Result.loss

    if (result === Result.tie)
        return this.highestCard(this.handValues(), opponent.handValues())

    return result;
}

PokerHand.prototype.compareFullHouse = function(opponent){

    const face1 = this.faceOfset(3);
    const face2 = opponent.faceOfset(3);

    let result = face1 > face2 ? Result.win : face1 === face2 ? Result.tie : Result.loss;

    if (result === Result.tie)
        return this.highestCard(this.handValues(), opponent.handValues())

    return result;

}

PokerHand.prototype.compareFlush = function(opponent){
    return this.highestCard(this.handValues(), opponent.handValues());
}

PokerHand.prototype.compareStraight = function(opponent){
    // return this.highestCard(this.handValues(), opponent.handValues());
    let yo = this.handValues().sort().join(' ');
    let tu = opponent.handValues().sort().join(' ');

    let i = stairs.indexOf(yo);
    let j = stairs.indexOf(tu);

    return  i > j ? Result.win : i === j ? Result.tie : Result.loss
}

PokerHand.prototype.compareThreeOfaKind = function(opponent){

    const face1 = this.faceOfset(3);
    const face2 = opponent.faceOfset(3);

    const result = face1 > face2 ? Result.win : face1 === face2 ? Result.tie : Result.loss

    if (result === Result.tie)
        return this.highestCard(this.handValues(), opponent.handValues())

    return result;
}

PokerHand.prototype.compareTwoPair = function(opponent){

    let myVal = this.facesOfset(2).reduce(reducer);
    let opVal = opponent.facesOfset(2).reduce(reducer);

    let result = myVal > opVal ? Result.win : myVal === opVal ? Result.tie : Result.loss;

    if (result === Result.tie)
        return this.highestCard(this.handValues(), opponent.handValues())

    return result;
}

PokerHand.prototype.compareOnePair = function(opponent){

    const face = this.getValue(this.faceOfset(2));
    const meHand = this.handValues().filter(val => val !== face);
    const opHand = opponent.handValues().filter(val => val !== face);

    return this.highestCard(meHand, opHand);
}

PokerHand.prototype.compareHighCard = function(opponent){
    const meHand = this.handValues();
    const opHand = opponent.handValues();

    return this.highestCard(meHand, opHand);
}

/**
 * PLAYS QUALIFIER
 */
PokerHand.prototype.isStraightFlush = function(){
    return this.sameSuit() && this.isSequential();
}

PokerHand.prototype.isFourOfAKind = function(){
    return Object.values(this.mapFace()).filter(e => e === 4).length > 0
}

PokerHand.prototype.isFullHouse = function(){
    return this.countPairsOrTrios('t') === 1 && this.countPairsOrTrios('p') === 1;
}

PokerHand.prototype.isFlush = function(){
    return this.sameSuit();
}

PokerHand.prototype.isStraight = function(){
    return this.isSequential();
}

PokerHand.prototype.isThreeOfaKind = function(){
    return this.countPairsOrTrios( 't');
}

PokerHand.prototype.isTwoPair = function(){
    return this.countPairsOrTrios( 'p') === 2;
}

PokerHand.prototype.isOnePair = function(){
    return this.countPairsOrTrios( 'p') === 1;
}

PokerHand.prototype.isHighCard = function(){
    return this.getCards().filter((v, i, a) => a.indexOf(v) === i).length === 5
}

let yo = new PokerHand("KH JH QH TS 9H");
let tu = new PokerHand("AD TD KD JS QD");
let r = yo.compareWith(tu);
console.log(r);


