class TabNavigation extends React.Component {
  renderTabButton(tabName, isActive) {
    return React.createElement(
      'button',
      {
        key: tabName,
        className: `px-4 py-2 rounded-lg transition-colors ${
          isActive
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 hover:bg-gray-200'
        }`,
        onClick: () => this.props.onTabChange(tabName),
      },
      tabName
    )
  }

  render() {
    const {activeTab, courses} = this.props

    return React.createElement(
      'div',
      {
        className: 'mb-6 flex gap-2 flex-wrap',
      },
      [
        // Overview tab
        this.renderTabButton('Overview', activeTab === 'overview'),

        // Course tabs
        ...courses.map((course) =>
          this.renderTabButton(course.name, activeTab === course.name)
        )
      ]
    )
  }
}

window.TabNavigation = TabNavigation