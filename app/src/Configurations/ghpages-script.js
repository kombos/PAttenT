var ghpages = require('gh-pages');
ghpages.publish('build', {
    branch: 'gh-pages',
    repo: 'https://github.com/kombos/mp-pages.git'
  }, function(err){
    console.log("gh-pages command output: ", err);
  });