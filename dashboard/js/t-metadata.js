$(document).ready(() => {

	var metadata = $("#metadata")

	// actualizar a template html
	template_html = "<li> <b>user</b>: {user}</li>            \
									 <li> <b>imdb</b>: {imdb}</li>            \
									 <li> <b>lang</b>: {lang}</li>            \
									 <li> <b>hash</b>: {hash}</li>            \
									 <li> <b>name</b>: {name}</li>            \
									 <li> <b>consumers</b>: {consumers}</li>"

	template_content = $("#metadata-ul")

	$(".metadata").click( (event) => {
		var parent   = $(event.target).parent()
		var position = parent.offset()
		var width    = $("#metadata-size").width()


		template_content.empty()
		template_content.append(sprintf(template_html, {
			user:      parent.data("metadataUser"),
			consumers: parent.data("metadataConsumers"),
			imdb:      parent.data("metadataImdb"),
			lang:      parent.data("metadataLang"),
			hash:      parent.data("metadataHash"),
			name:      parent.data("metadataFilename")}))

		// el tamaño una vez actualizado el contenido
		var height   = metadata.height()

		metadata.css({left: position.left, top: position.top - height})
		metadata.css({width: width + "px"})

		metadata.toggleClass("d-block d-lg-none  animate__animated animate__slideInRight")
	})

	$(document).on("click", (event) => {
		if (!$(event.target).is(".metadata")) {
			// Ocultar el dropdown inmediatamente si se hace clic fuera de él
			metadata.removeClass("d-block d-lg-none animate__animated animate__slideInRight")
		}
	})
})

