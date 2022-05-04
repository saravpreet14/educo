import cv2
from face_detection import face
from keras.models import load_model
import numpy as np
from embedding import emb

label=None
a={0:0,1:0,2:0}
people={0:"Simar", 1:"Mummy", 2:"Raman"}
e=emb()
fd=face()

model=load_model('face_rec/face_reco2.MODEL')

cap=cv2.VideoCapture(0)
ret=True

while ret:
    ret,frame=cap.read()
    frame=cv2.flip(frame,1)
    det,coor=fd.detectFace(frame)

    if(det is not None):
        for i in range(len(det)):
            detected=det[i]
            k=coor[i]
            f=detected
            detected=cv2.resize(detected,(160,160))
            detected=detected.astype('float')/255.0
            detected=np.expand_dims(detected,axis=0)
            feed=e.calculate(detected)
            feed=np.expand_dims(feed,axis=0)
            prediction=model.predict(feed)[0]

            result=int(np.argmax(prediction))
            if(np.max(prediction)>.70):
                for i in people:
                    if(result==i):
                        label=people[i]
                        a[i] += 1
                        if a[i] >= 10:
                            cv2.putText(frame,"Attendance Complete " + people[i],(k[0],k[1]-30),cv2.FONT_HERSHEY_SIMPLEX,1,(255,255,255),2)
            else:
                label='unknown'


            cv2.putText(frame,label,(k[0],k[1]),cv2.FONT_HERSHEY_SIMPLEX,1,(255,255,255),2)
            #if(abhi is not None):
                #if(a[abhi]==1):
                    #cv2.putText(frame,"your attendance is complete",(x,y-30),cv2.FONT_HERSHEY_SIMPLEX,1,(255,255,255),2)
            cv2.rectangle(frame,(k[0],k[1]),(k[0]+k[2],k[1]+k[3]),(252,160,39),3)
    cv2.imshow('frame',frame)
    if(cv2.waitKey(1) & 0XFF==ord('q')):
        break
cap.release()
cv2.destroyAllWindows()


for x in a.keys():
    if a[x] >= 10:
        print(x, end=';')