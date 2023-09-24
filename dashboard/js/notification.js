// TODO: crear un sistema de notificaciones facil de recordar,
// a nivel de javascript y estructura de html
$(document).ready(() => {

  let notification_storage = new MLocalStorage(
                                  sm_conf["NOTIFICATION_STORAGE_PREFIX"])

  // TODO: esto es temporal, la gestion de mensajes por id
  // se trabajara desde el backend
  $(".toast").each((index, element) => {
    if (notification_storage.get_without_prefix(element.id) == null) {
      $(element).addClass("show animate__animated animate__fadeInUp")
    }
  })

  $(".btn-toast").on("click", (event) => {
    notification_id = $(event.target).data("notificationId")

    // cada 6 horas se muestran de nuevo las notificaciones
    // enviadas desde el server
    notification_storage.set(
                    notification_id, true,
                    sm_conf["NOTIFICATION_STORAGE_TTL"])
  })


  let imdb_storage = new RLocalStorage(
                          sm_conf["IMDB_LIST_STORAGE_PREFIX"],
                          sm_conf["IMDB_LIST_STORAGE_NAME"],
                          sm_conf["IMDB_LIST_STORAGE_LIMIT"])

  $(".toast-notification").each((index, element) => {
    const notification = $(element).find(".toast-body")
    const message      = notification.text()
    const s_extra      = notification
      .data("notificationExtra")
      .replaceAll("'", "\"")
    let extra = {}

    try {
      extra = JSON.parse(s_extra)
    } catch (e) {}

    let movie = "undefined"
    if (extra["imdb"]) {
      movie = imdb_storage.get(extra["imdb"])
      if (!movie) {
        // cambiar a template
        notification.html(message.replace("{movie}", '<div class="spinner-grow text-info" style="width: .8rem; height: .8rem" role="statue"> </div>'))

        let mod = "imdb"
        let resource_id = extra["imdb"]

        if (extra["imdb"] == "kitsu") {
          mod = "kitsu"
          resource_id = extra["season"]
        }

        $.ajax({
          type: "GET",
          url: sprintf(sm_conf["API_EX_TITLE"], {
            "mod":         mod,
            "resource_id": resource_id}),
          dataType: 'json',
          success: function(data) {
            let movie = data['title'] || ''

            if (movie.length > 100) {
              movie = movie.substring(0, 100) + "...";
            }
            imdb_storage.set(extra["imdb"], movie, 0)
            // html se utiliza como -> hack decode
            notification.html(message.replace("{movie}", data["title"]))
          }
        })
        // html se utiliza como -> hack decode
      } else notification.html(message.replace("{movie}", movie))
    }

  })

  $(".toast-notification").addClass("show animate__animated animate__fadeInUp")
})
