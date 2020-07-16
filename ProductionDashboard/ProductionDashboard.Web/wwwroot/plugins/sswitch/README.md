# Sswitch
Author : Gopal Joshi<br/ >
Website: www.sgeek.org<br/ >
Plugin : sScroll<br/ >
Description: sSwitch is toggle switch. Turn checkboxes and radio buttons into toggle switches. 
Usage:

<b>Include CSS and JS</b>
<pre><code>&lt;link rel="stylesheet" type="text/css" href="css/style.css" /&gt;
&lt;script type="text/javascript" src="js/jquery.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="js/Sswitch.js"&gt;&lt;/script&gt;</code></pre>

<b>Add checkbox having class name "checkbox".</b>
<pre><code>&lt;input type="checkbox" name="checkboxName" class="checkbox" /&gt;</code></pre>

<b>Initialise plugin</b>
<pre>&lt;script&gt;
	$(document).ready(function(){
		$(".checkbox").Sswitch({
			onSwitchChange: function() {
			    // Your magic
			}
		});
	});
&lt;/script&gt;</pre>

That's it :)
