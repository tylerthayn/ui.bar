require(['jquery'], ($) => {
let modal = $(`
<div id="SourceModal" class="w3-modal">
	<div class="w3-modal-content">
		<div class="w3-container" style="padding:0px">
			<span onclick="document.getElementById('SourceModal').style.display='none'" class="w3-button w3-display-topright w3-red w3-hover-red">&times;</span>
			<div class="w3-bar w3-black">
				<button class="w3-bar-item w3-button" onclick="ShowSource('html')">html</button>
				<button class="w3-bar-item w3-button" onclick="ShowSource('css')">css</button>
				<button class="w3-bar-item w3-button" onclick="ShowSource('js')">js</button>
			</div>
			<div id="html" class="source" style="display:none">
				<code class="html">html</code>
			</div>
			<div id="css" class="source" style="display:none">
				<code class="css">css</code>
			</div>
			<div id="js" class="source">
				<code class="js">js</code>
			</div>
		</div>
	</div>
</div>
`)

function ShowSource (type) {
	$('#SourceModal div.source').css('display', 'none')
	$('#'+type).css('display', 'block')
}

$(() => {
	$('head').append(`<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">`)
	$('body').append($(`<div class="Buttons"><input type="button" class="Source btn" value="Source"></div>`))
	$('body').append(modal)

	$('input.Source').on('click', () => {
		$.get($('script.Main').attr('data-main').replace(/(\.js)*$/, '.js'), content => {
			modal.find('code.js').text(content)
			modal.find('code.css').text($('style.Example').text())
			modal.find('code.html').text($('div.Example')[0].outerHTML)

			modal.css('display', 'block')
		})
	})
})

})