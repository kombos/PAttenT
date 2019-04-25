const ghpages = require('gh-pages');

ghpages.publish('build', {
    branch: 'gh-pages',
    repo: 'https://github.com/kombos/mp-ropsten.git',
}, (err) => {
    console.log('gh-pages branch command output: ', err);
});
