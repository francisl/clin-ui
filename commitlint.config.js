const Configuration = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-case': [2, 'always', 'lower-case'],
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 100],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'github-ticket-number': [2, 'always'],
  },
  plugins: [
    {
      rules: {
        'github-ticket-number': ({ githubTicketNumber = null }) => {
          const ticketReg = /^CLIN-\d+$/;
          let containTicketNumber = false;
          if (githubTicketNumber) {
            containTicketNumber = !!githubTicketNumber.trim().match(ticketReg);
          }

          return [
            containTicketNumber,
            `Ticket number should not be empty\n\t\te.g. type([scope]): CLIN-[Jira issue] message\n\t\tGot : ${githubTicketNumber}`,
          ];
        },
      },
    },
  ],
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w*)(\([a-zA-Z0-9_ ]+\))?:\s?(\s[\w+\-]*\d+)\s?([\w ]*)?$/,
      headerCorrespondence: ['type', 'scope', 'githubTicketNumber', 'subject'],
    },
  },
};

module.exports = Configuration;
