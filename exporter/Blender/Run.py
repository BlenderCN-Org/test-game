#script to run:
SCRIPT = "C:/Program Files/Blender Foundation/Blender/2.62/scripts/addons/webgl_export.py"  
    
#path to your org.python.pydev.debug* folder (it may have different version number, in your configuration):
PYDEVD_PATH='C:/Program Files/eclipse_js/plugins/org.python.pydev.debug_2.5.0.2012040618/pysrc'

import pydev_debug as pydev

pydev.debug(SCRIPT, PYDEVD_PATH, trace = True)
