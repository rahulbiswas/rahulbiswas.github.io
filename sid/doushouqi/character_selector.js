const CharacterSelector = ({selectedAvatar, onSelectAvatar, onClose, language}) => {
  const avatars = [
    {id: 'meilin', nameEn: 'Meilin', nameCn: '美琳', file: 'images/avatar_0.svg'},
    {id: 'feizi', nameEn: 'Feizi', nameCn: '非子', file: 'images/avatar_1.svg'},
    {id: 'hana', nameEn: 'Hana', nameCn: '哈娜', file: 'images/avatar_2.svg'},
    {id: 'gobinda', nameEn: 'Gobinda', nameCn: '戈宾达', file: 'images/avatar_3.svg'},
    {id: 'amelie', nameEn: 'Amélie', nameCn: '阿梅莉', file: 'images/avatar_4.svg'}
  ]

  const currentIndex = avatars.findIndex(a => a.id === selectedAvatar)
  const currentAvatar = avatars[currentIndex]
  const displayName = language === 'c' ? currentAvatar.nameCn : currentAvatar.nameEn
  const title = language === 'c' ? '选择对手' : 'SELECT OPPONENT'

  const handlePrevious = () => {
    const newIndex = currentIndex === 0 ? avatars.length - 1 : currentIndex - 1
    onSelectAvatar(avatars[newIndex].id)
  }

  const handleNext = () => {
    const newIndex = currentIndex === avatars.length - 1 ? 0 : currentIndex + 1
    onSelectAvatar(avatars[newIndex].id)
  }

  return React.createElement('div', {
      className: 'character-selector-overlay',
      onClick: onClose
    },
    React.createElement('div', {
      className: 'character-selector-container',
      onClick: (e) => e.stopPropagation()
    },
      React.createElement('div', {className: 'character-selector-header'},
        React.createElement('h1', {className: 'character-selector-title'}, title),
        React.createElement('button', {
          className: 'character-selector-close',
          onClick: onClose
        }, '×')
      ),
      React.createElement('div', {className: 'character-selector-content'},
        React.createElement('button', {
          className: 'character-selector-arrow',
          onClick: handlePrevious
        }, '←'),
        React.createElement('div', {className: 'character-selector-avatar'},
          React.createElement('img', {
            src: currentAvatar.file,
            alt: displayName
          }),
          React.createElement('div', {className: 'character-selector-name'},
            displayName
          )
        ),
        React.createElement('button', {
          className: 'character-selector-arrow',
          onClick: handleNext
        }, '→')
      )
    )
  )
}

window.CharacterSelector = CharacterSelector
