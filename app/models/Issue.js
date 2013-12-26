/* From WhatTheDuck.js */
/*global WhatTheDuck*/

WhatTheDuck.Issue = function(issue) {
    this.issueNumber = issue.issueNumber;
    this.inCollection = issue.inCollection;
    this.issueCondition = issue.issueCondition;

};

WhatTheDuck.Issue.IssueCondition = {
    BAD_CONDITION: 'mauvais',
    NOTSOGOOD_CONDITION: 'moyen',
    GOOD_CONDITION: 'bon',
    NO_CONDITION: 'indefini'
};