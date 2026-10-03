# Ejemplo de una clase Humano

#Creamos la clase Humano
class Humano():
	#Definimos al Humano
	def __init__(self, edad, nombre, ocupacion):
		self.edad = edad
		self.nombre = nombre
		self.ocupacion = ocupacion 
     
       
    #Creación de un nuevo método (función que imprime un mensaje)
	def presentar(self):
		presentacion = "Hola soy " + self.nombre + " mi edad es " + str(self.edad) + " y mi ocupación es " + self.ocupacion #armo el mensaje
		print (presentacion)
   
            
        #Creamos un nuevo método para cambiar la ocupación:
        #En caso que esta persona sea contratada
        
	def contratar(self, puesto): #añadimos un nuevo parámetro en el método
		self.puesto = puesto
		print (self.nombre + " ha sido contratado como " + self.puesto)
		#Ahora cambiamos el atributo ocupación
		self.ocupacion = puesto 
        

# Programa Principal
      
Persona1 = Humano(31, "Pedro", "Desocupado") #Instancia
Persona1.presentar() #Llamamos al método
Persona1.contratar("Obrero")
Persona1.presentar()#Lo volvemos a presentar luego de su contratación


