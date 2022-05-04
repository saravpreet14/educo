from keras.models import load_model

class emb:
    def __init__(self):
        self.model=load_model('face_rec/facenet_keras.h5')
    def calculate(self,img):
        return self.model.predict(img)[0]
