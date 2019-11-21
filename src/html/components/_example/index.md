---
layout: L-alloy
title: Example
about: The ___ component does this ___. Use this for (x) purpose, don't use it for (y) purpose.
---

## About

{{ page.about }}

## Alternatives

This HTML element is a solid, simplified alternative, especially in the case of \_\_\_. <http://html5doctor.com/the-details-and-summary-elements/>
Another is \_\_\_ because it's better at \_\_\_ (eg animation performance).

## Accessibility

2019-01-18: This module hasn't been tested with assistive tech, there may be better code out there.
2019-01-18: This module has been tested by Pachiello Group with VoiceOver on iOS, and JAWs and Firefox, fully accessible with keyboard.

## Requirements

## Issues

Eg, Works in IE11, but Edge 14-17 don't support object:fit on video elements

Use local images to explain an issue if it helps `![alt text](img/icon48.png)` ![alt text](img/icon48.png)

## Examples

{% include_relative example--simple.html %}

{% highlight html %}
{% include_relative example--simple.html %}
{% endhighlight %}

{% include_relative example--complex.html %}

{% highlight html %}
{% include_relative example--complex.html %}
{% endhighlight %}

## JS - Parameters

- Param1 - **defaults: true** - whether to cover the screen with a mask
- Param2 - **defaults: true** - whether to close the modal when the mask is clicked on
- Param3 - **defaults: undefined** - URL pointing to a html file that will be rendered inside this modal

## References / inspiration

Collapsible Sections - Heydon explores
<https://inclusive-components.design/collapsible-sections/>
