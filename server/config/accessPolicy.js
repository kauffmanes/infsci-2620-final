const policy = {
  User: {
    operators: [
      'Answer:Create',
      { 'name': 'Answer:Delete', when: params => params.user.id === params.post.author },
      'Flag:GetAll',
      'Keyword:GetAll',
      'Question:GetAll',
      'Question:Create',
      'Question:Flag',
      'Question:Get',
      { 'name': 'Question:Delete', when: params => params.user.id === params.post.author },
      'Title:GetAll',
      { 'name': 'User:Get', when: params => params.user.id === params.token.id },
      { 'name': 'User:Delete', when: params => params.user.id === params.token.author },

    ]
  },
  Moderator: {
    operators: [
      'Question:RemoveFlag',
      'Answer:Delete',
      'Question:Delete',
      'Title:Create',
      'User:Delete'
    ],
    inherits: ['user']
  },
  Admin: {
    operators: [
      'AccessLevel:GetAll',
      'AccessLevel:Create',
      'Flag:Create',
      'Keyword:Create',
      'Keyword:Delete'
    ],
    inherits: ['moderator']
  }
};

module.exports = policy;
