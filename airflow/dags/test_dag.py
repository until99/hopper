from airflow import DAG
from airflow.operators.bash import BashOperator
from datetime import datetime

with DAG(
    dag_id="teste_minimal",
    start_date=datetime(year=2024, month=1, day=1),
    schedule="@once",
) as dag:

    task = BashOperator(
        task_id="print_test",
        bash_command='echo "DAG funcional!"',
    )
