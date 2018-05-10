export default {
   name: 'CoursesComponent',
   components: {},
   data: () => ({
      height: 0,
      trackURL: '',
      loaded: false,
      categories: [],
      drawer: {
         isOpen: true,
         isRight: false
      },
      current: {
         categorie: {
            id: '',
            title: '',
            topic: {
               title: ''
            }
         }
      }
   }),
   created() {
      this.drawer.isRight = this.$store.state.direction === 'rtl'
      this.$store.commit('getGithubFileURL', {
         repo: `${this.$route.params.track}-tutorials`,
         path: 'topics.json'
      })
      this.$http.get(this.$store.state.githubFileURL)
         .then(data => {
            data = data.categories
            if ((Number(this.$route.params.course) > 0 && Number(this.$route.params.course) <= data.length) &&
               (Number(this.$route.params.number) > 0 && Number(this.$route.params.number) <=
                  data[Number(this.$route.params.course)].topics.length)) {
               data.forEach((categorie, index) => {
                  this.categories.push({
                     topics: [],
                     id: index + 1,
                     title: categorie[`title-${this.$store.state.lang}`],
                     active: Number(this.$route.params.course) === index + 1 ? true : false
                  })
                  categorie.topics.forEach((course, courseNumber) => {
                     this.$store.commit('getGithubFileURL', {
                        repo: `${this.$route.params.track}-tutorials`,
                        path: `${course.id}/topic-${this.$store.state.lang}.txt`
                     })
                     let url = this.$api.b64EncodeUnicode(this.$store.state.githubFileURL)
                     let type = this.$api.b64EncodeUnicode(course.type)
                     this.categories[index]['topics'].push({
                        query: {
                           url: url,
                           type: type
                        },
                        complete: false,
                        id: courseNumber + 1,
                        type: this.getType(course.type),
                        title: course[`title-${this.$store.state.lang}`],
                        url: {
                           name: 'course',
                           params: {
                              course: index + 1,
                              number: courseNumber + 1
                           },
                           query: {
                              url: url,
                              type: type
                           }
                        }
                     })
                     if (index === data.length - 1 && courseNumber === data[data.length - 1].topics.length - 1) {
                        let categorie = this.categories[Number(this.$route.params.course) - 1]
                        let topic = categorie.topics[Number(this.$route.params.number) - 1]
                        this.categories[0].complete = true
                        this.current.categorie = {
                           id: categorie.id,
                           title: categorie.title,
                           topic: {
                              title: topic.title
                           }
                        }
                        this.$router.replace({
                           query: {
                              url: topic.query.url,
                              type: topic.query.type
                           }
                        })
                        this.trackURL = `/tracks/${this.$route.params.track}`
                        this.loaded = true
                     }
                  })
               })
            } else {
               this.$router.push('/404')
            }
         }).catch(err => {
            console.error(err)
         })
   },

   watch: {
      $route(to, from) {
         let categorie = this.categories[Number(this.$route.params.course) - 1]
         let topic = categorie.topics[Number(this.$route.params.number) - 1]
         document.querySelector('.courses >.content > div').scrollTop = 0
         this.current.categorie = {
            id: categorie.id,
            title: categorie.title,
            topic: {
               title: topic.title
            }
         }
      }
   },
   methods: {
      onResize() {
         if (document.querySelector('.courses >.toolbar') !== null) {
            this.height = window.innerHeight - document.querySelector('.courses >.toolbar').offsetHeight
         } else {
            let self = this
            setTimeout(() => {
               self.height = window.innerHeight - document.querySelector('.courses >.toolbar').offsetHeight
            }, 1000)
         }
      },
      getClass(categorie) {
         if (categorie.complete) {
            return 'complete-state'
         } else if (categorie.id === this.current.categorie.id) {
            return 'active-state'
         }
      },
      // getClass(categorie) {
      //    let cls = ''
      //    if (categorie.complete) {
      //       cls = 'complete-state'
      //    } else if (categorie.id === this.current.categorie.id) {
      //       cls = 'active-state'
      //    }
      //    return !categorie.active ? `elevation-1 ${cls}` : cls
      // },
      isTopicActive(id, number) {
         let categorieId = Number(this.$route.params.course)
         let topic = Number(this.$route.params.number)
         if (categorieId === id && topic > number) {
            if (number + 1 === topic) {
               return 'topic-complete-state'
            } else {
               return 'topic-all-complete-state'
            }
         } else if (categorieId === id && topic === number) {
            return 'topic-active-state'
         }
      },
      // isTopicActive(topic) {
      //
      // },
      getType(type) {
         switch (type) {
            case 'quiz':
               return 'star'
               break
            case 'video':
               return 'play_arrow'
               break
            case 'text':
               return 'menu'
               break
            case 'task':
               return 'build'
               break
         }
         // return 'build'
      }
   }
}