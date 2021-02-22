const defaultState = {
  text: [{ indexCurrent: 0, text: "(function name(param){\nreturn param;\n})('Hiiii')" }],
  tabIndex: 0,
  user: {
    id: 1,
    avatarUrl: "https://png.pngtree.com/png-vector/20190321/ourmid/pngtree-vector-users-icon-png-image_856952.jpg"
  },
  bot: {
    id: 0,
    avatarUrl: "https://png.pngtree.com/png-vector/20190321/ourmid/pngtree-vector-users-icon-png-image_856952.jpg"
  },
  messages: [
    {
      author: {
        id: 0,
        avatarUrl: "https://png.pngtree.com/png-vector/20190321/ourmid/pngtree-vector-users-icon-png-image_856952.jpg"
      },

      timestamp: (new Date()).toString(),
      text: "Hiiii"
    }
  ]
};

export default function (state = defaultState, action = {}) {
  switch (action.type) {
    case 'UPDATE':
      return {
        ...state,
        text: action.text,
        foo: {
          ...state.foo,
          bar: action.text,
        },
        // tabIndex:action.tabIndex
      };
    case 'UPDATE_TAB':
      return {
        ...state,
        tabIndex: action.text
      };
    case 'UPDATE_M':
      return {
        ...state,
        messages: action.text
      };
    case 'UPDATE_LAST_M':
      let newMessages = state.messages
      newMessages[state.messages.length - 1].text = action.text
      return {
        ...state,
        messages: newMessages
      };
    default:
      return state;
  }
}