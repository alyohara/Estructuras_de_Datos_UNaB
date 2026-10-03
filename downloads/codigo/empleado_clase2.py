class Empleado:
    def __init__(self, nombre, edad, dni):
        self.nombre = nombre
        self.edad = edad
        self.dni = dni

    def __str__(self):
        cadenaPrint=self.nombre+","+str(self.edad)+","+str(self.dni)
        return cadenaPrint
         

#programa ppal

empleado1=Empleado("Juan", 30, 12345678)
print(empleado1)
