// {{{ function toggleGroup
function toggleGroup(element)
{
	toggleServicesBlock(element.parentNode);

	var iconElement = element.firstChild;
	while (iconElement.nextSibling)
	{
		if (iconElement.className)
		{
			break;
		}

		iconElement = iconElement.nextSibling;
	}

	toggleExpandIcon(iconElement);
}
// }}}
// {{{ function toggleServicesBlock
function toggleServicesBlock(element)
{
	var id = element.getAttribute('id');
	var servicesId = id.replace(/group/, "services");

	var servicesBlock = document.getElementById(servicesId);

	toggleClass(servicesBlock, 'collapsed');
}
// }}}
// {{{ function toggleExpandIcon
function toggleExpandIcon(element)
{
	toggleClass(element, 'expand', 'collapse');
}
// }}}
// {{{ function toggleClass
function toggleClass(element, className1, className2)
{
	var classes = element.className.split(/\s+/);
	var tmp_classes = new Array();

	for (var i=0; i < classes.length; i++)
	{
		if (classes[i] == className1)
		{
			if (className2)
			{
				tmp_classes[tmp_classes.length] = className2;
			}

			continue;
		}
		else if (className2 && classes[i] == className2)
		{
			tmp_classes[tmp_classes.length] = className1;

			continue;
		}

		tmp_classes[tmp_classes.length] = classes[i];
	}

	if (!className2 && tmp_classes.length == classes.length)
	{
		tmp_classes[tmp_classes.length] = className1;
	}

	element.className = tmp_classes.join(' ');
}
// }}}
;
