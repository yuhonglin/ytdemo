from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse

from django.template import RequestContext, loader

import os

APP_DIR = os.path.dirname(os.path.dirname(__file__))

def index(request):
    template = loader.get_template( os.path.join(APP_DIR, 'demo/templates/index.html') )
    context = RequestContext(request, {
        'a': 1,
    })
    return HttpResponse(template.render(context))
