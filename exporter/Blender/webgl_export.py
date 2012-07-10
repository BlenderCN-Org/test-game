'''
WebGL export add-on
'''
#--- ### Header
bl_info = {
    "name": "WebGL export",
    "author": "Alvaro Leal",
    "version": (1, 0, 1),
    "blender": (2, 6, 2),
    "api": 36147,
    "location": "File > Export",
    "category": "Export",
    "description": "Exports the selected objects in WebGL format",
    "warning": "",
    "wiki_url": "",
    "tracker_url": ""
    }
#--- ### Imports
import bpy
import json
from bpy.utils import register_module, unregister_module

def convert_to_triangles():
    # Convert all the mesh's faces to triangles
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.quads_convert_to_tris()
    bpy.context.scene.update()
    bpy.ops.object.mode_set(mode='OBJECT') # set it in object
    
def precision(vector):
    result = []
    for value in vector:
        result.append(round(value,2))
    return result

class VertexData:
    def __init__(self, position, texCoord, normal):
        self.position = position
        self.texCoord = texCoord
        self.normal = normal
    
    def equal(self, other):
        result = False
        if (self.position == other.position and
            self.texCoord == other.texCoord and
            self.normal == other.normal):
            result = True
        return result
        
class VertexDataList:
    def __init__(self):
        self.list = []
    
    def __index(self, vertexData):
        index = 0
        for vertex in self.list:
            if vertex.equal(vertexData):
                return index
            index += 1
        return -1 
        
    def add(self, vertexData):
        index = self.__index(vertexData)
        if index < 0:
            self.list.append(vertexData)
            return len(self.list)-1
        else:
            return index
            
    def toList(self):
        result = []
        for vertex in self.list:
            result.extend(vertex.position)
            result.extend(vertex.texCoord)
            result.extend(vertex.normal)
        return result

def export_json():
    convert_to_triangles()
    
    obj = bpy.context.active_object
    mesh = obj.data
    
    vertexDataList = VertexDataList()
    vertexIndexList = []
    
    uvtex = mesh.uv_textures.active
    for uv_index, uv_itself in enumerate(uvtex.data):
        uvs = uv_itself.uv1, uv_itself.uv2, uv_itself.uv3, uv_itself.uv4
        for vertex_index, vertex_itself in enumerate(mesh.faces[uv_index].vertices):
            vertex = mesh.vertices[vertex_itself]
            
            vertexData = VertexData(precision(vertex.co.xyz),
                                    precision(uvs[vertex_index].xy),
                                    precision(vertex.normal.xyz))
            
            vertexIndexList.append(vertexDataList.add(vertexData))
            
    texture = ''
    for m in mesh.materials:
        for slot in m.texture_slots:
            if (slot) and (slot.texture) and (slot.texture.type == "IMAGE"):
                texture = slot.texture.image.filepath.replace('/', '')
    
    texture = 'img/' + texture
    
    return json.dumps({'index'  : [vertexIndexList],
                       'vertex'  : [vertexDataList.toList()],
                       'texture': texture},
                      indent=4)

#--- ### Core operation
def export():
    """Exports the selected object 
       Arguments:
            @obj (Object): an object with a mesh. 
    """
    with open('D:/alem/workspaces/python/scene.json', 'wb') as file:
        file.write(export_json().encode('utf-8'))

#--- ### Operator
class WebGLexport(bpy.types.Operator):
    ''' Exports the selected objects in WebGL format'''
    bl_idname = "export.webgl"
    bl_label = "WebGL export"
    
    #--- Blender interface methods        
    def execute(self,context):
        export()
        return {'FINISHED'}

def menu_draw(self, context):
    self.layout.operator(WebGLexport.bl_idname, "WebGL")
    
#--- ### Register
def register():
    register_module(__name__)
    bpy.types.INFO_MT_file_export.prepend(menu_draw)
    
def unregister():
    bpy.types.INFO_MT_file_export.remove(menu_draw)
    unregister_module(__name__)
    
#--- ### Main code    
if __name__ == '__main__':
    register()

