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


def test():
    obj = bpy.context.active_object
    mesh = obj.data
    
    vertices_list = []
    vertices_co_list = []
    vertices_index_list = []
    normals_list = []
    uv_coord_list = []
    
    is_editmode = (obj.mode == 'EDIT') # You can get TexFace info only in
    # object mode
    if is_editmode:
        bpy.ops.object.mode_set(mode='OBJECT', toggle=False)
    
    
    uvtex = mesh.uv_textures.active # Points to texture which is
    # shown on mesh itself therefore active
    
    for uv_index, uv_itself in enumerate(uvtex.data):
        # uvtex.data has 4 UV coordinates per face
        # (face is made of 4 vertices,
        # each vertex has its own UV coordinates)
        uvs = uv_itself.uv1, uv_itself.uv2, uv_itself.uv3, uv_itself.uv4
        # uvs is a variable (Python tuple?) you can access to face 4
        # different UV coordinates like:
        # uvs[0]
        # uvs[1]
        # uvs[2]
        # uvs[3]
        
        print("Per Face vertex info")
        
        for vertex_index, vertex_itself in enumerate(mesh.faces[uv_index].vertices):
            # pay attention, it is loop inside loop!
            # When we have taken uv_itself then it has unique index
            # Mesh faces are stored with same indexes
            # mesh.faces[uv_index].vertices gives us 4 vertices which make
            # a face
            # with uv_index we find from faces correct face which 4 UV
            # coordinates we have stored in uvs variable (tuple?)
            # vertex_index goes from 0 to 3 like uvs[0...3]
            # again they do match
            # you would use it like this
            # print(uvs[vertex_index])
            
            #mesh = bpy.data.mesh[0]
            #mesh.vertices[0].co.xyz
            #mesh.vertices[0].normal.xyz
            vertex = mesh.vertices[vertex_itself]
            
            vertices_list.append(vertex_itself)
            vertices_co_list.append(vertex.co.xyz)
            normals_list.append(vertex.normal.xyz)
            vertices_index_list.append(vertex_index)
            # ^ For tris index is from 0 to 2, for quads 0 to 3
            # (4 vertices make a quad)
            uv_coord_list.append(uvs[vertex_index])
            # uvs is a float array
            
            # Lets see what we have stored:
            print("index " + str(vertices_list[-1]))
            # ^ vertices_list
            print("v " + str(vertices_co_list[-1][0]) + " " + str(vertices_co_list[-1][1]) + " " + str(vertices_co_list[-1][2]))
            # ^ vertices_co_list
            print("n " + str(normals_list[-1][0]) + " " + str(normals_list[-1][1]) + " " + str(normals_list[-1][2]))
            # ^ normals_list
            print("f " + str(vertices_index_list[-1]))
            # ^ vertices_index_list
            print("uv " + str(uv_coord_list[-1][0]) + " " + str(uv_coord_list[-1][1]) + "\n")
            # ^ uv_coord_list

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
    
    vertices_list = []
    vertices_co_list = []
    face_vertex_index_list = []
    normals_list = []
    uv_coord_list = []
    total = []
    
    vertexDataList = VertexDataList()
    vertexIndexList = []
    
    uvtex = mesh.uv_textures.active
    i = 0
    for uv_index, uv_itself in enumerate(uvtex.data):
        uvs = uv_itself.uv1, uv_itself.uv2, uv_itself.uv3, uv_itself.uv4
        for vertex_index, vertex_itself in enumerate(mesh.faces[uv_index].vertices):
            vertex = mesh.vertices[vertex_itself]
            
            #vertices_list.append(vertex_itself)
            vertices_list.append(i)
            vertices_co_list.extend(precision(vertex.co.xyz))
            normals_list.extend(precision(vertex.normal.xyz))
            face_vertex_index_list.append(vertex_index)
            uv_coord_list.extend(precision(uvs[vertex_index].xy))
            
            total.extend(precision(vertex.co.xyz))
            total.extend(precision(uvs[vertex_index].xy))
            total.extend(precision(vertex.normal.xyz))
            
            vertexData = VertexData(precision(vertex.co.xyz),
                                    precision(uvs[vertex_index].xy),
                                    precision(vertex.normal.xyz))
            vertexIndexList.append(vertexDataList.add(vertexData))
            
            i = i + 1

    texture = ''
    for m in mesh.materials:
        for slot in m.texture_slots:
            if (slot) and (slot.texture) and (slot.texture.type == "IMAGE"):
                texture = slot.texture.image.filepath.replace('/', '')
    
    texture = 'img/' + texture
    
    return json.dumps({'vert'   : [vertices_co_list],
                       'uv'     : [uv_coord_list],
                       'normal' : [normals_list],
#                       'index'  : [vertices_list],
                       'index'  : [vertexIndexList],
#                       'total'  : [total],
                       'total'  : [vertexDataList.toList()],
                       'texture': texture},
                      indent=4)

def old_export():
    test()
    
    convert_to_triangles()
    
    vert = ''
    uv   = ''
    normal = ''
    index = ''
    texture = ''
    
    obj = bpy.context.active_object
    mesh = obj.to_mesh(bpy.context.scene, True, "PREVIEW")
    
    for v in mesh.vertices:
        vert += "%.2f,%.2f,%.2f," % (v.co[0], v.co[1], v.co[2])
        normal += "%.2f,%.2f,%.2f," % (v.normal[0], v.normal[1], v.normal[2])
    
    for texture in mesh.uv_textures:
        for face in texture.data:
            uv += "%.2f,%.2f," % (face.uv1[0], face.uv1[1])
            
    for f in mesh.faces:
        index += "%d,%d,%d," % (f.vertices[0],f.vertices[1],f.vertices[2])
        
    for m in mesh.materials:
        for slot in m.texture_slots:
            if (slot) and (slot.texture) and (slot.texture.type == "IMAGE"):
                texture = slot.texture.image.filepath
                
    return json.dumps({'vert'   : [vert[:-1]],
                       'uv'     : [uv[:-1]],
                       'normal' : [normal[:-1]],
                       'index'  : [index[:-1]],
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

