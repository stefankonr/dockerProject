FROM python:3.12
LABEL authors="kstef"

WORKDIR /code



COPY ./requirements.txt /code/requirements.txt
RUN pip3 install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./app /code

ENV PYTHONPATH "${PYTHONPATH}:/code/app/"

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8081"]