/* global sharing */
var nouns = [],
    verbs = [],
    imgs = [];
 
var build = [
  'build',
  'make',
  'do',
  'construct',
  'achieve',
  'accomplish',
  'execute',
  'consummate',
  'fulfill',
  'complete',
  'finish'
];

var verbSlugs = [
  'Teaching the world to VERB through the power of the web.',
  'Learn to VERB for free, online.',
  'Ever wanted to VERB but didn\'t know how? Now there\'s no excuse.',
  'Change the world. Learn to VERB.'
];

var subs = [
  'Our modern world is more VERBED than ever. Speak the language.',
  'The will to VERB is the will to succeed. Make it so.',
  'Learning the fundamentals of how to VERB will help you achieve your dreams.',
  'Everyone you know has learned to VERB. Keep up with the Joneses.',
  'Get VERBED.'
];

Array.prototype.pick = function() {
  return this[Math.floor(Math.random()*this.length)];
};

Array.prototype.pickRemove = function() {
  var index = Math.floor(Math.random()*this.length);
  return this.splice(index,1)[0];
};

function generate(noun, verb) {
  var verb = verb || verbs.pick();
  var hue = Math.floor(Math.random()*360);
  $('body').css('background','hsl(' + hue  + ',40%,97%)');
  $('#name').css('color','hsl(' + hue  + ',40%,57%)');
  var school = verb.capitalize() + 'School';
  var slug = verbSlugs.pick().replace('VERB', verb);
  $('#name').html(school);
  $('#slug').html(slug);
  $('#company').html('&copy; ' + verb.capitalize() + 'Co 2013');
  var tmpBuild = _.clone(build);
  $('#sub1').text(tmpBuild.pickRemove().capitalize());
  $('#sub2').text(tmpBuild.pickRemove().capitalize());
  $('#sub3').text(tmpBuild.pickRemove().capitalize());
  var tmpSubs = _.clone(subs);
  $('#ex0').text(tmpSubs.pickRemove().replace('VERBED', ed(verb)).replace('VERB', verb));
  $('#ex1').text(tmpSubs.pickRemove().replace('VERBED', ed(verb)).replace('VERB', verb));
  $('#ex2').text(tmpSubs.pickRemove().replace('VERBED', ed(verb)).replace('VERB', verb));

  // images
  $.when($.ajax({
    url: 'https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=' + verb + '&callback=?',
    dataType:'jsonp'
  })).done(function(img_data) {
    console.log(img_data);
    imgs = $.map(img_data.responseData.results, function(el) { return el.tbUrl; });
    $('#img0').attr('src',imgs[0]);
    $('#img1').attr('src',imgs[1]);
    $('#img2').attr('src',imgs[2]);
  });

}

function ed(word) {
  if (word[word.length-1] === 'e') {
    return word+'d';
  }
  return word+'ed';
}

function getWords(suppressGenerate) {
  $.when(
    $.ajax({
      url: 'http://api.wordnik.com/v4/words.json/randomWords?minCorpusCount=10000&minDictionaryCount=5&excludePartOfSpeech=proper-noun,proper-noun-plural,proper-noun-posessive,suffix,family-name,idiom,affix&hasDictionaryDef=true&includePartOfSpeech=noun&limit=1000&maxLength=22&api_key='+key.API_KEY,
      async: false,
      dataType:'json'
    }),
    $.ajax({
      url: 'http://api.wordnik.com//v4/words.json/randomWords?limit=1000&excludePartOfSpeech=adjective&hasDictionaryDef=true&includePartOfSpeech=verb-transitive&minCorpusCount=1000&api_key='+key.API_KEY,
      async: false,
      dataType:'json'
    })
  ).done(function(noun_data, verb_data, img_data) {
    nouns = $.map(noun_data[0], function(el) { return el.word; });
    verbs = $.map(verb_data[0], function(el) { return el.word; });
    if (!suppressGenerate) {
      generate();
    }
  });
}

$('#generate').click(function() { generate(); });
getWords();
