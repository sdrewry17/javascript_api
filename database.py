#dependencies
import pandas as pd
import numpy as np


# SQLAlchemy 
import sqlalchemy
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy import Column, Integer, String, Float, Date


#Creating Engine / Session
engine = create_engine("sqlite:///bellybutton.sqlite", echo=False)
session = Session(engine)


#create the schema in the database
Base.metadata.create_all(engine)


#use to commit changes to the data base
session.commit()