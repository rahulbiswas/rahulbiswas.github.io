const RulesModal = ({onClose, language}) => {
  const [htmlContent, setHtmlContent] = React.useState('')
  
  React.useEffect(() => {
    const fileName = language === 'c' ? 'rules_content_c.html' : 'rules_content.html'
    fetch(fileName)
      .then(response => response.text())
      .then(html => setHtmlContent(html))
      .catch(error => console.error('Error loading rules:', error))
  }, [language])
  
  return React.createElement('div', {
      className: 'rules-modal-overlay',
      onClick: onClose
    },
    React.createElement('div', {
      className: 'rules-modal-container',
      onClick: (e) => e.stopPropagation()
    },
      React.createElement('div', {className: 'rules-modal-header'},
        React.createElement('h1', {className: 'rules-modal-title'}, language === 'c' ? '游戏规则' : 'GAME RULES'),
        React.createElement('button', {
          className: 'rules-modal-close',
          onClick: onClose
        }, '×')
      ),
      React.createElement('div', {
        className: 'rules-modal-content',
        dangerouslySetInnerHTML: {__html: htmlContent}
      })
    )
  )
}

window.RulesModal = RulesModal
