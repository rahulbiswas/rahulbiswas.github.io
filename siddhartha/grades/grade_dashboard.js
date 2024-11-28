const parseXMLString = (xmlString) => {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml')
  return parseXMLData(xmlDoc)
}

class GradeDashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      courses: [],
      loading: true,
      error: null,
      activeTab: 'Overview',
      user: null
    }
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      this.setState({ user })
      if (user) {
        this.fetchGrades()
      } else {
        this.setState({ 
          courses: [],
          loading: false,
          error: null 
        })
      }
    })
  }

  fetchGrades() {
    console.log('GradeDashboard: Starting to fetch grades...')
    db.collection("grades")
      .doc("latest")
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log('GradeDashboard: Document retrieved, attempting to parse XML')
          const xmlString = doc.data().gradesXML
          try {
            const courses = parseXMLString(xmlString)
            console.log(`GradeDashboard: Successfully parsed ${courses.length} courses`)
            this.setState({
              courses,
              loading: false,
            })
          } catch (parseError) {
            console.error('GradeDashboard: XML parsing error:', parseError)
            throw parseError
          }
        } else {
          console.error('GradeDashboard: No document found in Firestore')
          throw new Error("No grades data found")
        }
      })
      .catch((err) => {
        console.error('GradeDashboard: Error details:', {
          code: err.code,
          message: err.message,
          stack: err.stack
        })
        this.setState({
          error: 'Failed to load grades. Please try again later.',
          loading: false,
        })
      })
  }

  handleTabChange = (tabName) => {
    this.setState({activeTab: tabName})
  }

  renderAuthButtons() {
    const { user } = this.state
    return React.createElement(
      'div',
      {
        className: 'absolute top-4 right-4 flex items-center gap-4',
      },
      user ? [
        React.createElement(
          'span',
          { 
            className: 'text-sm text-gray-600',
            key: 'email'
          },
          user.email
        ),
        React.createElement(
          'button',
          {
            className: 'px-4 py-2 bg-gray-200 rounded hover:bg-gray-300',
            onClick: signOut,
            key: 'signout'
          },
          'Sign Out'
        )
      ] : React.createElement(
        'button',
        {
          className: 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600',
          onClick: signIn
        },
        'Sign In with Google'
      )
    )
  }

  renderContent() {
    const {activeTab, courses} = this.state

    return activeTab === 'Overview'
      ? React.createElement(
        'div',
        {
          className: 'space-y-4',
        },
        courses.map((course, idx) =>
          React.createElement(OverviewCard, {key: idx, course: course}),
        ),
      )
      : React.createElement(CourseDetail, {
        course: courses.find(
          (c) => c.name === activeTab,
        ),
      })
  }

  render() {
    const { loading, error, user } = this.state

    if (!user) {
      return React.createElement(
        'div',
        {
          className: 'max-w-6xl mx-auto p-6 text-center',
        },
        [
          React.createElement(
            'h1',
            {
              className: 'text-2xl font-bold mb-6',
              key: 'title'
            },
            'Grade Dashboard'
          ),
          React.createElement(
            'p',
            {
              className: 'mb-4',
              key: 'message'
            },
            'Please sign in to view grades'
          ),
          this.renderAuthButtons()
        ]
      )
    }

    if (loading) {
      return React.createElement(
        'div',
        {
          className: 'max-w-6xl mx-auto p-6 text-center',
        },
        'Loading grades...',
      )
    }

    if (error) {
      return React.createElement(
        'div',
        {
          className: 'max-w-6xl mx-auto p-6 text-red-500',
        },
        error,
      )
    }

    return React.createElement(
      'div',
      {
        className: 'max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6 my-8 relative',
      },
      [
        this.renderAuthButtons(),
        React.createElement(
          'h1',
          {
            className: 'text-2xl font-bold mb-6',
          },
          'Grade Dashboard',
        ),
        React.createElement(TabNavigation, {
          activeTab: this.state.activeTab,
          courses: this.state.courses,
          onTabChange: this.handleTabChange
        }),
        this.renderContent()
      ],
    )
  }
}